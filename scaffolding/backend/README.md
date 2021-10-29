# ESE2021 Scaffolding Backend

## Prerequisite
You should have installed [NodeJS and npm](https://nodejs.org/en/download/) (they come as one) in order to start the backend server.

## Start
- you should already have cloned the ese2021-project-scaffolding repository.
- navigate to the backend folder `cd ese2021-project-scaffolding/backend`
- run `npm install`
- run `npm run dev`
- open your browser with the url [http://localhost:3000](http://localhost:3000/)

## About
This part of the repository serves as a template for common problems you will face as a backend developer during your project. It is by no means complete but should give you a broad overview over the frameworks, libraries and technologies used. Please refer to the [reading list](https://github.com/scg-unibe-ch/ese2021/wiki/Reading-list) for links and tutorials.

We tried to show you different approaches how your backend may be structured, however you are free to follow your own principles.
Notice the differences between the [UserController](./src/controllers/user.controller.ts) and e.g. [TodoItemController](./src/controllers/todoitem.controller.ts). 

1. The logic is split up:
	- authorizing a request is done via middleware
	- logic e.g. creating/authentication is done via [UserService](./src/services/user.service.ts)
2. The controller itself is structured as a class.

Note that the `UserController`-approach is more suited for bigger architectures and for typescript applications. You may choose any aproach you wish, but make sure your code is well structured.

Here are more resources you can read: 

- [tsconfig](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [alternative example repo](https://github.com/maximegris/typescript-express-sequelize)
- [alternative example repo](https://developer.okta.com/blog/2018/11/15/node-express-typescript)

## Quick Links
These are links to some of the files that we have implemented/modified when developing the backend:

- Middleware
	- [the function](./src/middlewares/checkAuth.ts)
	- [how to use in express](./src/controllers/secured.controller.ts)
- Login: 
	- [service](./src/services/user.service.ts)
	- [controller](./src/controllers/user.controller.ts)
- Registration:
	- [service](./src/services/user.service.ts)
	- [controller](./src/controllers/user.controller.ts)
- [crud](./src/controllers/todolist.controller.ts)
- [typescript config](./src/tsconfig.json)
- [routing](./src/controllers)
- [API construction](./src/server.ts)

## Endpoints
Some endpoints can be called in a [browser](http://localhost:3000), others have to be called by a REST Client. [Here](./postman_collection) you can find a collection that contains all requests, which you can import into Postman. [Postman](https://www.postman.com/) is a REST Client.

### `/todoitem`
- POST

	<details>
		<summary>Request</summary>

	```json
		{
			"name": "string",
			"done": "boolean",
			"todoListId":"number"
		}
	```

	</details>

	<details>
		<summary>Response</summary>

		Code: 200
		Body:

	```json
	{
		"todoItemId": "number",
		"name": "string",
		"done": "boolean",
		"todoListId":"number"
	}
	```
</details>

- PUT `/:id`

	<details>
		<summary>Request</summary>

	```json
		{
			"name": "string",
			"done": "boolean",
			"todoListId":"number"
		}
	```

	</details>

	<details>
		<summary>Response</summary>

		Code: 200
		Body:

	```json
	{
		"todoItemId": "number",
		"name": "string",
		"done": "boolean",
		"todoListId":"number"
	}
	```
</details>

- POST `/:id/image`

	<details>
		<summary>Request</summary>

	```json
		{
			"filename": "File"
		}
	```

	</details>

	<details>
		<summary>Response</summary>

		Code: 200
		Body:

	```json
	{
		"imageId": "number",
		"fileName": "string",
		"todoItem": "number",
		"updatedAt": "string",
		"createdAt": "string"
	}
	```
</details>

- GET `/:id/image`

	<details>
		<summary>Request</summary>

	```json
		{}
	```

	</details>

	<details>
		<summary>Response</summary>

		Code: 200
		Body:

	```json
	{
		"imageId": "number",
		"fileName": "string",
		"todoItem": "number",
		"updatedAt": "string",
		"createdAt": "string"
	}
	```
</details>

- DELETE `/:id`<br/>
	Response: Status: 200

### `/todolist`
- POST
	<details>
		<summary>Request</summary>

		Code: 200
		Body:
	```json
	{
		"name":"string"
	}

	```
	</details>
	<details>
		<summary>Response</summary>

		Code: 200
		Body:
	```json
	{
		"todoListId": "number",
		"name":"string"
	}

	```
	</details>

- PUT `/:id`
	<details>
		<summary>Request</summary>

		Code: 200
		Body:
	```json
	{
		"name":"string"
	}

	```
	</details>
	<details>
		<summary>Response</summary>

		Code: 200
		Body:
	```json
	{
		"todoListId": "number",
		"name":"string"
	}

	```
	</details>

- DELETE `/:id`<br>
	Response: Status: 200

- GET
	<details>
		<summary>Response</summary>
		
		Code: 200
		Body:
	```json
	{
		"todoListId": "number",
		"name":"string",
		"todoItems":"TodoItem[]"
	}
	```
	</details>
### `/post`
  - POST `/create`
    <details>
        <summary>Request</summary>

          Header: Authorization: Bearer  + `token`
          Body:
      ```json
      {
          "title":"string",
          "text":"string",
          "image":"string"
      }

      ```
    </details>

    <details>
        <summary>Response</summary>
		
        Code: 200 
        Body:
    ```json
    {
        "postId": 4,
        "title": "string",
        "text": "string",
        "image": "string",
        "userId": 1,
        "updatedAt": "2021-10-26T12:08:13.091Z",
        "createdAt": "2021-10-26T12:08:13.091Z"
    }
    ```
        Code: 500
        Body:
    ```json
    {
        "error": "titleIsEmpty",
        "message": "Title cannot be emtpy"
       }
    ```
        Code: 403
        Body:
    ```json
    {
       "message": "Unauthorized"
    }
    ```
    </details>
  - POST `/:id/image`
    <details>
        <summary>Request</summary>

          Please use "form-data" as a body format.

          Header: Authorization: Bearer  + `token`
          Body:
      ```json
      {
          "image":"<Bilddatei>"
      }

      ```
    </details>

    <details>
        <summary>Response</summary>

        Code: 200 
        Body:
    ```json
    {
        "postId": 4,
        "title": "string",
        "text": "string",
        "image": "URL_to_image",
        "userId": 1,
        "updatedAt": "2021-10-26T12:08:13.091Z",
        "createdAt": "2021-10-26T12:08:13.091Z"
    }
    ```
    	- Post don't exists in database:
        Code: 500
        Body:
    ```json
    {
        "error": "Post_not_found",
        "message": "Cant find Post nr.<xy>"
	   }
    ```
        - User isn't autorized to edit this Post:
        Code: 500
        Body:
    ```json
    {
       "error": "not_authorized",
       "message": "Youre not authorized to modify post: 2"
    }
    ```
    	- No Image in Post or wrong format:
        Code: 500
	    Body:
	```json
    {
       "error": "Upload_error",
       "message": "Cant upload image"
    }
    ```
    </details>

### `/user`
- POST `/register`
    <details>
        <summary>Request</summary>

        Code: 200
        Body:
    ```json
    {
        "userName":"string",
        "password":"string"
    }

    ```
    </details>
    <details>
        <summary>Response</summary>

        Code: 200
        Body:
    ```json
    {
       "admin": false,
    "userId": 1,
    "userName": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "address": "string",
    "phone": "string",
    "birthday": 324234234,
    "password": "string-hashed",
    "updatedAt": "2021-10-19T12:59:12.710Z",
    "createdAt": "2021-10-19T12:59:12.710Z"
  }

    ```
      Code: 500
      Body:
    ```json
  {
    "message": {
        "error": "username_already_exists",
        "message": "fdm1 already exists"
      }
  }
    ```
      Code: 500
      Body:
    ```json
  {
    "message": {
        "error": "email_already_exists",
        "message": "x@y.com already exists"
      }
  }
    ```
    </details>

- POST `/login`
    <details>
        <summary>Request</summary>

        Code: 200
        Body:
    ```json
    {
        "userName":"string",
        "password":"string"
    }

    ```
    </details>
    <details>
        <summary>Response</summary>

        Code: 200
        Body:
    ```json
    {
      "user": {
        "userId": 1,
        "userName": "Nora",
        "firstName": "Nora",
        "lastName": "Nora",
        "email": "ddd",
        "address": "street",
        "phone": "123",
        "birthday": 12122000,
        "password": "$2b$12$TDIbNFTDA6W/8.yorAOvauPdrBaUSPku2iyX9pMQTlEyRRhEP6gvS",
        "admin": false,
        "createdAt": "2021-10-13T12:51:56.790Z",
        "updatedAt": "2021-10-13T12:51:56.790Z"
     },
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6Ik5vcmEiLCJ1c2VySWQiOjEsImFkbWluIjpmYWxzZSwiaWF0IjoxNjM0MTMwNTk4LCJleHAiOjE2MzQxMzc3OTh9.sKgZGDjrdPQlFPAgx2T0v9gl_SeK6F7GxWG4OHwbH7c"
    }

    ```
        Code: 500
        Body:
    ```json
  {
    "message": {
      "error": "usernameNotFound",
      "message": "username not found"
      }
  }
    ```
        Code: 500
        Body:
    ```json
  {
    "message": {
      "error": "wrongPassword",
      "message": "wrong Password"
   	  }
  }
    ```
    </details>

- GET
    <details>
        <summary>Response</summary>

        Code: 200
        Body:
    ```json
    [
        {
            "userId":"string",
            "userName":"string",
            "password":"stirng(hashed)"
        },
        {
            "userId":"string",
            "userName":"string",
            "password":"stirng(hashed)"
        }
		
    ]

    ```
    </details>

### `/secured`
- GET
	<details>
		<summary>Request</summary>

		Header: Authorization: Bearer  + `token`
	</details>

	<details>
		<summary>Response</summary>

		Code: 200 | 403
		Body:
	```json
	{
		"message":"string"
	}

	```
	</details>
	
### `/admin`
- GET
	<details>
		<summary>Request</summary>

	Header: Authorization: Bearer  + `token`
	</details>

	<details>
		<summary>Response</summary>

		Code: 200 | 403
		Body:
	```json
	{
		"message":"string"
	}

	```
	</details>

### `/`
- GET
	<details>
		<summary>Response</summary>
  		Code: 200
		Body:
		<h1>Welcome to the ESE-2021 Course</h1><span style="font-size:100px;"> &#127881; </span>
  	</details>
