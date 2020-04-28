# serverless-todo Capstone

## Running the application from client
1. Download the code: git clone repositry.
2. Install dependencies: npm i
3. Start the client : npm start

## Creating a serverless application using backend code
1. Download the code.
2. Install dependencies.
3. Deploy the code: sls deploy -v

## Extra feature added in the application apart from the one developed in Project 4 of the course.
1. Added one more lambda function [imageUpate.ts](/backend/src/lambda/dynamodb/)
2. This function get triggered with dynamodb streams and StreamViewType is NEW_AND_OLD_IMAGES. 
3. Functionality of this function:
   1. If we delete a todo item then it will delete the image from s3 if it is there to save space.
   2. If the status of todo item is update to done then the image colour will change to black and white.
4. Screenshot of todo item when it is not completed:
![Uncheck Image](https://github.com/ArjunSingh007/serverless-todo/raw/master/images/Image%20uncheck.PNG)
5. Screenshot of todo item when it is completed:
![Check Image](https://github.com/ArjunSingh007/serverless-todo/raw/master/images/Image%20check.PNG)
6. Refresh the page after clicking check box to see the greyed image.

