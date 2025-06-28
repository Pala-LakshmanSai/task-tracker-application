import User from "@/models/User"

const getNameFromTheEmail = async (email: string) => {
    const user = await User.findOne({email: email})
    return  user?.email;
}
export default getNameFromTheEmail;
