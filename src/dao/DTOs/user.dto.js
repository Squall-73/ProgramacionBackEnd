export default class UserDTO{
    constructor(user){
        this.full_name= user.first_name + " " + user.last_name
        this.age = user.age
        this.email = user.email
        this.role = user.role.charAt(0).toUpperCase() + user.role.slice(1)
    }
}