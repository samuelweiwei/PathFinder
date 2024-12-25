import { Schema } from "rsuite"
const { StringType, NumberType } = Schema.Types;
const loginFormModel = Schema.Model({
    username: StringType().isRequired('This field is required'),
    password: StringType().isRequired('This field is required')
});
export default loginFormModel;