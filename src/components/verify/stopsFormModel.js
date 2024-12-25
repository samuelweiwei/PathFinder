import { Schema } from "rsuite"
const { StringType, NumberType } = Schema.Types;
const stopsFormModel = Schema.Model({
    stops: StringType().isRequired('This field is required'),
    steps: NumberType().range(1, 30).isRequired('This field is required')
});
export default stopsFormModel;