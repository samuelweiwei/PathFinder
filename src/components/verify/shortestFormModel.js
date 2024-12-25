import { Schema } from "rsuite"
const { StringType } = Schema.Types;
const shortestFormModel = Schema.Model({
    stops: StringType().isRequired('This field is required')
});
export default shortestFormModel;