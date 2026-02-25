import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder({ order }) {
    const fetcher = useFetcher();

    return (
        <fetcher.Form method="PATCH" className="text-right">
            <Button type="primary">Make priority</Button>
        </fetcher.Form>
    );
}

export async function action({ request, params }) {
    const data = { priority: true };
    const orderID = params.orderID;
    const updatedOrder = await updateOrder(orderID, data);
    console.log(updatedOrder);
    // ----------REVALIDATION ---------
    // We do not need to redirect anywhere here beacuse React-Router knows that data has changed
    // beacuse of this action. So React-Router will re-fetch the data and re-render the page
    // with new data.
    return null;
}

export default UpdateOrder;
