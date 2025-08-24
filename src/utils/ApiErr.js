class ApiErr extends Error{

    constructor(statusCode, msg="Failed API", err=[]){
        super(msg)
        this.statusCode = statusCode
        this.msg= msg
        this.err = err
        this.data = null
        this.success = false

    }

}

export { ApiErr }