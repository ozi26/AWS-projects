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


<img width="1615" height="964" alt="architecture" src="https://github.com/user-attachments/assets/677f4c92-314f-4194-bcd9-72ec02199839" />


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
  +  Permissions: Search and attach `AWSLambdaBasicExecutionRole`, `AWSDynamoDBFullAccess`.
    (This lets Lambda write logs to CloudWatch).
  + Role name: `lambda-Visitor-count-role `
  +  Create role`.
---
Step 2️⃣ 
+ Setup DynamoDB Tables

  VisitorCounter Table
  
   + Partition key: `id `(String)
   + Item: `{ "id": "counter", "count": 0 }`
     
    VisitLogs Table
  
   + Partition key: `visit_id` (String, UUID)
   + Attributes: `timestamp`, `ip`,` user_agent`
---
Step 3️⃣ 
+ Create two (2) Lambda functions (`python 3.12`)
  
  + Go to `AWS Lambda` → Create function.
  + Author from scratch:
  + Function name: `Visitors Count`
  + Runtime: `python 3.12`
  + Architecture: `x86_64` (default is fine)
  + Change default execution role: Use an existing role → select lambda-joke-role
  + Click Create function.
  + Add the code
  + Replace the contents with your lambda code.
    
+ Repeat the same process for the second function.
  
   + Function name: `Visitors Logs`
  
+ Increase Lambda timeout
  
  + Configuration → General configuration → Edit:
  + Timeout: set to `10` seconds → Save.
  
---
Step 4️⃣
+ Create the API Gateway HTTP API.

   + Go to API Gateway Console → Create API.
   + Choose HTTP API → Click Build.
   + Configure:
      + Name: `VisitorCounterAPI`
   + Click Next
     
+ Add an integration
   + Integration target: Lambda Function
   + Select UpdateVisitorCount

Route Settings:

Add a route: GET. 
   + Endpoint 1: `/count` → Lambda: `visitors_count`
   + Endpoint 2: `/logs` → Lambda: `visitors_logs`
   + Click Next

Deploy:

+ Stage name: `prod`
   + Click Deploy
   + Copy the Invoke URL (you’ll use this in your frontend).

 > Example: https://abc123xyz.execute-api.region.amazonaws.com/count
    
+ CORS (important):
  
  + In the API’s left sidebar, click CORS (or during creation if prompted).
  + Enable CORS.
  + Allow origins: `* `(dev-friendly; you can restrict later to your exact domain)
  + Allow methods: `GET`, `OPTIONS`
  + Allow headers: `Content-Type`
  + Expose headers: (leave empty)
  + Save.
  + Deploy (create a new stage before you deploy).
    
---
Step 5️⃣ 
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
  + Copy the Bucket website endpoint (e.g., http://bucket-name-123.s3-website-us-east-1.amazonaws.com).
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



