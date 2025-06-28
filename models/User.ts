import {Model, models, Schema, model} from "mongoose"
export interface UserInterface extends Document {
  name: string
  email: string
  password: string
}

const UserSchema = new Schema<UserInterface>({
  name: {type: String, required: false},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const UserModel: Model<UserInterface> = models.User || model<UserInterface>('User', UserSchema)
export default UserModel;