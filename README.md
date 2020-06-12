# CAPSTONE Serverless Expense Tracker

# Functionality of the application

This application will allow creating/removing/updating/fetching EXPENSE items. Each EXPENSE item can optionally have an attachment receipt image. Each user only has access to EXPENSE items that he/she has created.

# EXPENSE items

The application should store EXPENSE items, and each EXPENSE item contains the following fields:

* `expenseId` (string) - a unique id for an expense item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of an EXPENSE item (e.g. "eating out")
* `paymentDate` (string) - date and time by which an item should be paid
* `done` (boolean) - true if an item was paid and completed, false otherwise
* `attachmentUrl` (string) - a URL pointing to a receipt image attached to an EXPENSE item

# How to run this CAPSTONE application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless EXPENSE application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
