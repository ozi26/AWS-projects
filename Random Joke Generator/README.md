# 😂 Random Joke Generator (AWS Cloud Project)

A beginner-friendly AWS Cloud project that demonstrates how to integrate **API Gateway**, **Lambda**, and a **Frontend Website** to fetch and display random jokes from a public API.

---

## 📌 Project Overview

The **Random Joke Generator** is a simple full-stack cloud project that:

- Uses **AWS Lambda** as a backend function.
- Fetches jokes from the public API: [`https://official-joke-api.appspot.com`](https://official-joke-api.appspot.com).
- Exposes the Lambda function via **Amazon API Gateway** (`GET /joke` endpoint).
- Displays the joke on a **frontend web page** (HTML, CSS, JavaScript).
- Teaches **CORS configuration**, **API Gateway integration**, and **Lambda proxying**.

---

## 📝 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [AWS Services Used](#aws-services-used)
- [Prerequisites](#prerequisites)
- [Deployment Steps](#deployment-steps)
- [Usage](#usage)
- [Future Improvements](#future-improvements)

---
## 🏗️ Architecture

<img width="1536" height="1024" alt="Architectural Diagram" src="https://github.com/user-attachments/assets/a93b6efb-0026-4f13-a7d8-51e62bc3c8f8" />

---
⚡ How It Works

1. A user clicks Get Joke on the frontend.
2. The frontend calls the API Gateway endpoint.
3. API Gateway triggers the Lambda function.
4. Lambda returns a random joke as JSON.
5. The frontend displays the joke instantly.
---
🌟 Features
+ Serverless architecture (no servers to manage).
+ Beginner-friendly AWS integration.
+ Fully documented workflow.
+ Extendable to other APIs (facts, quotes, trivia).
---

## 🔧 AWS Setup Instructions
Step ❶ 
+ Create the IAM role for Lambda
  + Sign in to the AWS Management Console.
  + Open IAM → Roles → Create role.
  + Trusted entity type: AWS service.
  + Use case: Choose Lambda → Next.
  +  Permissions: Search and attach AWSLambdaBasicExecutionRole
    (This lets Lambda write logs to CloudWatch).
  + Role name: lambda-joke-role → Create role.
---
Step ❷ 
+ Create the Lambda function (Node.js 20)
  + Go to AWS Lambda → Create function.
  + Author from scratch:
  + Function name: random-joke-lambda
  + Runtime: Node.js 20.x
  + Architecture: x86_64 (default is fine)
  + Change default execution role: Use an existing role → select lambda-joke-role
  + Click Create function.
  + Add the code
  + In the code editor (index.mjs or index.js area), replace the contents with your lambda code.
+ Set environment variable (optional)
  + In the Lambda’s Configuration tab → Environment variables → Edit → Add:
  + Key: `JOKE_API_URL`
  + Value: `https://official-joke-api.appspot.com/random_joke`
  + Save. (This makes it easy to switch APIs later.)
+ Increase Lambda timeout
  + Configuration → General configuration → Edit:
  + Timeout: set to 10 seconds → Save.
  + Test the function
---
Step ❸ 
+ Create the API Gateway HTTP API ( We’ll expose a GET /joke route that invokes your Lambda ).
  + Go to API Gateway → Create API → choose HTTP API (not REST).
  + Build → Add integration: choose Lambda → select your region & random-joke-lambda.
+ Configure routes:
  + Method: `GET`
  + Resource path: `/joke`
  + Integration target: your Lambda
+ CORS (important):
  + In the API’s left sidebar, click CORS (or during creation if prompted).
  + Enable CORS.
  + Allow origins: `* `(dev-friendly; you can restrict later to your exact domain)
  + Allow methods: `GET`, `OPTIONS`
  + Allow headers: `Content-Type`
  + Expose headers: (leave empty)
  + Save.
  + Deploy (HTTP APIs auto-create a $default stage, but ensure you Deploy or Publish if prompted).
+ Find your Invoke URL
  + In the API’s Stages (likely $default), copy the Invoke URL.
  + Your full endpoint will be: (https://<api-id>.execute-api.<region>.amazonaws.com/joke)
---
Step ❹  Build the Frontend (single file).  Create a new file on your PC: `index.html` (any folder). Paste the complete html code and change the API GATEWAY URL.
+ (Optional) Host the frontend on Amazon S3 (Static Website)
  + Go to S3 → Create bucket:
  + Bucket name: unique (e.g., praise-random-joke-123)
  + Region: same region as your API (recommended)
  + Uncheck “Block all public access” (for simple static hosting demo).
  + Acknowledge the warning → Create bucket.
  + Upload index.html to the bucket.
  + Bucket → Properties → scroll to Static website hosting:
  + Enable → Index document: index.html → Save.
  + Copy the Bucket website endpoint (e.g., http://praise-random-joke-123.s3-website-us-east-1.amazonaws.com).
  + Permissions → Bucket policy → Edit → paste (replace YOUR_BUCKET_NAME):
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
       {
      "Sid": "PublicReadForStaticWebsite",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
      ]
    }
  ```
---
🌟 Future Improvements
  + Add a loading spinner on click, disable the button while fetching.
  + Restrict CORS allow-origin to your S3 website URL for better security.
  + Switch to your own API key–based provider and store the key as a Lambda environment variable (never in frontend).
 



