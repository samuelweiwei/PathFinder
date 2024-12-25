import { Schema } from "rsuite"
const { StringType, NumberType } = Schema.Types;
const routeDistFormModel = Schema.Model({
    stops: StringType().isRequired('This field is required'),
    steps: NumberType().range(1, 100).isRequired('This field is required')
});
export default routeDistFormModel;