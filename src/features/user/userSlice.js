import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { getAddress } from "../../services/apiGeocoding";

function getPosition() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// This will also become a Action Creator which we can dispatch normally like 'updateName'
export const fetchAddress = createAsyncThunk(
    "user/fetchAddress",
    async function () {
        // 1) We get the user's geolocation position
        const positionObj = await getPosition();
        const position = {
            latitude: positionObj.coords.latitude,
            longitude: positionObj.coords.longitude,
        };

        // 2) Then we use a reverse geocoding API to get a description of the user's address, so we can display it the order form, so that the user can correct it if wrong
        const addressObj = await getAddress(position);
        const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

        // 3) Then we return an object with the data that we are interested in

        // a) This data returned will become the "action.payload" of FULFILLED state
        // b) In case of ERROR, error message string is automatically placed in "action.error.message"
        return { position, address };
    },
);

const initialState = {
    username: "",
    status: "idle",
    position: {},
    address: "",
    error: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateName(currentState, action) {
            currentState.username = action.payload;
        },
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchAddress.pending, (currentState, action) => {
                currentState.status = "loading";
            })
            .addCase(fetchAddress.fulfilled, (currentState, action) => {
                currentState.status = "idle";
                currentState.position = action.payload.position;
                currentState.address = action.payload.address;
            })
            .addCase(fetchAddress.rejected, (currentState, action) => {
                currentState.status = "error";
                // currentState.error = action.error.message;   // We could have used this also
                currentState.error =
                    "There was a problem getting your address. Make sure to fill this field!";
            }),
});

export const { updateName } = userSlice.actions; // This will give us Action Creators

export default userSlice.reducer;
