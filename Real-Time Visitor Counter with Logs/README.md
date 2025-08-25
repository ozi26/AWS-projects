# :computer: Real-Time Visitor Counter With Logs (AWS Cloud Project)

This project demonstrates how to build a scalable, serverless visitor counter with timestamped visit logs, IP address, and user agent details, powered entirely by AWS services.

#  Overview

The Real-Time Visitor Counter with Logs project is a cloud-native, serverless web application that tracks and logs website visitors in real time. It demonstrates how modern cloud services can be combined to build scalable, cost-efficient, and production-ready applications without managing traditional servers.

At its core, this application performs two main functions:
   + Counts website visits in real time – every new visit automatically updates the counter.
   + Logs visit details – including timestamp, IP address, and user agent for each request.

These logs can be retrieved through a dedicated API endpoint, making it easy to analyze traffic history.
# Purpose & Problem Solved
In many scenarios—such as personal blogs, portfolio sites, marketing campaigns, or internal dashboards—there is a need to track user activity without relying on heavy external analytics platforms (like Google Analytics).

This project provides:

✅ A lightweight alternative to complex analytics solutions

✅ Full transparency & control over collected data (stored securely in DynamoDB)

✅ A serverless, pay-as-you-go model, making it cost-effective for individuals and startups

✅ A foundation for custom analytics dashboards and visitor insights
# Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [AWS Services Used](#aws-services-used)
- [Prerequisites](#prerequisites)
- [Architecture Highlights](#architecture-highlights)
- [AWS Setup Instructions](#aws-setup-instructions)
- [Future Improvements](#future-improvements)

# Architecture

<img width="1536" height="1024" alt="Architectural diagram (vcl)" src="https://github.com/user-attachments/assets/ba8e35d2-bb0a-4d0a-94e8-3570a704d4a2" />


---
# Features
+ 🔢 Real-Time Visitor Counter – Increments every time someone visits.
  
+ 🕒 Visit Logs with Timestamps – Stores each visit with date/time in DynamoDB.
  
+ 🌐 Visitor Info Capture – Stores IP address & user agent.
  
+ 📊 API Endpoints –
  
   + `/count` → Returns updated visitor count.
   + `/logs` → Returns all past visit logs.
+ ☁️ Serverless Architecture – Scales automatically with zero server management.
  
+ 🔒 Secure & Cost-Efficient – Pay only for what you use.

# AWS Services Used
   + Amazon DynamoDB → NoSQL database to store counts and logs.
     
   + AWS Lambda → Backend logic to process requests.
     
   + Amazon API Gateway → Secure REST API endpoints.
     
   + Amazon CloudWatch → Logs and monitoring.
     
   + (Optional) Amazon S3 + CloudFront → Host frontend webpage.  

# Prerequisites
   + An AWS account (free tier is fine).
     
   + A modern browser (Chrome/Edge/Firefox).
     
   + (Optional but handy) Python 3 installed so you can run a tiny local web server:
     
      + In PowerShell: `python --version` → if missing, download from python.org.
        
   + (Optional) VS Code to edit files comfortably.
     
     > Note: Windows Operating System

#  Architecture Highlights

The project leverages multiple AWS services to achieve seamless functionality:

   + Amazon API Gateway → Exposes secure REST endpoints (/count and /logs)

   + AWS Lambda → Executes backend logic without managing servers

   + Amazon DynamoDB → Stores both the visitor count and detailed logs

   + Amazon CloudWatch → Provides centralized logging and monitoring

   + Amazon S3 + CloudFront (Optional) → Hosts the frontend web application globally

This architecture is event-driven, highly available, and scales automatically to handle any number of visitors.

#  AWS Setup Instructions
Step 1️⃣ 
+ Create the IAM role for Lambda
  
  + Sign in to the AWS Management Console.
  + Open `IAM` → `Roles` → Create role.
  + Trusted entity type: AWS service.
  + Use case: Choose Lambda → Next.
  +  Permissions: Search and attach AWSLambdaBasicExecutionRole
    (This lets Lambda write logs to CloudWatch).
  + Role name: `lambda-joke-role → Create role`.
---
Step 2️⃣ 
+ Create the Lambda function (`python 3.18x`)
  
  + Go to `AWS Lambda` → Create function.
  + Author from scratch:
  + Function name: random-joke-lambda
  + Runtime: `Node.js 20.x`
  + Architecture: `x86_64` (default is fine)
  + Change default execution role: Use an existing role → select lambda-joke-role
  + Click Create function.
  + Add the code
  + In the code editor (`index.mjs` or `index.js` area), replace the contents with your lambda code.
    
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
Step 3️⃣
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
Step 4️⃣ 
Build the Frontend (single file).  Create a new file on your PC: `index.html` (any folder). Paste the complete html code and change the API GATEWAY URL.

+ (Optional) Host the frontend on Amazon S3 (Static Website)
  
  + Go to `S3` → Create bucket:
  + Bucket name: unique (e.g., praise-random-joke-123)
  + Region: same region as your API (recommended)
  + Uncheck “Block all public access” (for simple static hosting demo).
  + Acknowledge the warning → Create bucket.
  + Upload index.html to the bucket.
  + Bucket → Properties → scroll to Static website hosting:
  + Enable → Index document: `index.html` → Save.
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
> Because your API Gateway CORS is Allow-Origin: *, your S3-hosted page can call it without extra changes. In production, restrict CORS to your exact S3 website origin.
---
# Future Improvements
   + 🔐 Add authentication for logs endpoint
     
   + 📍  Track location with IP geolocation API
     
   + 📊 Visualize logs with charts (e.g., Chart.js)
     
   + ⏳  Add retention policy to old logs



