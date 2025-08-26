# :mailbox: Serverless Contact Form

A modern **serverless contact form** built on **AWS Cloud**, allowing users to submit a message, upload an image, and get confirmation — **without managing servers**.  


#  Overview
This application lets users:

   - Fill out a **contact form** (Name, Email, Phone, Subject, Message)
  
   - **Upload an image** (stored securely in Amazon S3)
  
   - Submit details to **API Gateway → Lambda → DynamoDB**
  
   - Get an instant **confirmation** when their message is saved

All powered by a **pay-per-use, fully managed** AWS architecture.
# Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [AWS Services Used](#aws-services-used)
- [Prerequisites](#prerequisites)
- [AWS Setup Instructions](#aws-setup-instructions)
- [Future Improvements](#future-improvements)

# Architecture

<img width="1615" height="964" alt="architecture" src="https://github.com/user-attachments/assets/677f4c92-314f-4194-bcd9-72ec02199839" />

---
# Features
+ 🌐 Static website frontend hosted on S3

+ ⚡ Serverless backend with API Gateway + Lambda (Python)

+ 💾 Form data stored in DynamoDB

+ 🖼️ Images uploaded securely via S3 pre-signed URLs

+ 🔒 Built-in CORS & IAM permissions

+ 📊 Scalable, cost-efficient, and production-ready

# AWS Services Used
   + Backend: AWS Lambda (Python 3.12)

   + API Gateway: HTTP API for serverless endpoints

   + Storage: Amazon S3 (Uploads + Static Website Hosting)

   + Database: Amazon DynamoDB

   + Logs/Monitoring: CloudWatch Logs

   + IAM: Fine-grained permissions

   + Frontend: HTML, CSS, JavaScript (Fetch API)

# Prerequisites
   + An AWS account (free tier is fine).
     
   + A modern browser (Chrome/Edge/Firefox).
     
   + (Optional) VS Code to edit files comfortably.
     
> Note: Windows Operating System

#  AWS Setup Instructions
Step 1️⃣
+ Create the S3 bucket for website hosting (frontend)
   + S3 → Create bucket.
   + Bucket name: `my-contact-form-website-<random>` (must be globally unique).
   + Region: your chosen region.
   + Uncheck “Block all public access” (we need public reads for a static website). Confirm the warning.
   + Create the bucket.

+ Enable static website hosting
   + Open the bucket → Properties tab → Static website hosting → Edit.
   + Enable → Hosting type: “Host a static website”.
   + Index document: index.html
   + Save.

+ Allow public read (bucket policy)
   + Permissions tab → Bucket policy → Edit.
   + Paste this policy (replace YOUR-WEBSITE-BUCKET with your bucket name):

  
  ```json
  {
  "Version": "2012-10-17",
  "Statement": [
      {
      "Sid": "PublicReadForWebsite",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-WEBSITE-BUCKET/*"
       }
    ]
  }
  ```
> Note the Website endpoint shown under Properties → Static website hosting. It looks like: `http://YOUR-WEBSITE-BUCKET.s3-website-<region>.amazonaws.com`.

> You’ll upload index.html here later.

Step 1️⃣
+ Create the S3 bucket for uploads (images)
   + Bucket name: `my-contact-form-uploads-<random>` (must be globally unique).
   + Region: your chosen region.
   + Keep Block all public access ON (uploads remain private)
   + Create the bucket.
+ Add CORS to the uploads bucket
   + This allows the browser to PUT the image using the pre-signed URL.
   + Open the uploads bucket → Permissions → CORS configuration → Edit.
   + Paste:
  
  ```json
  {
  "CORSRules": [
      {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["PUT", "GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
      }
    ]
  }
  ```
> For production, replace "*" in AllowedOrigins with your website origin (e.g., http://YOUR-WEBSITE-BUCKET.s3-website-<region>.amazonaws.com).

Step 1️⃣ 
+ Create the IAM role for Lambda
  + `IAM` → `Roles` → Create role.
  + Trusted entity type: AWS service.
  + Use case: Choose Lambda → Next.
  +  Permissions: Search and attach `AWSLambdaBasicExecutionRole`.
    (This lets Lambda write logs to CloudWatch).
  + Role name: `ServerlessContactFormRole `
  +  Create role.
+ Open the role you just created → Add permissions → Attach policies → Create inline policy.

  ```json
  {
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPresignPutObject",
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::YOUR-UPLOADS-BUCKET/*"
    },
    {
      "Sid": "DynamoDBWrite",
      "Effect": "Allow",
      "Action": ["dynamodb:PutItem"],
      "Resource": "arn:aws:dynamodb:us-east-1:YOUR-AWS-ACCOUNT-ID:table/ContactMessages"
      }
    ]
  }
  ```
   + Review policy, name it. e.g `ServerlessContactFormAccess`, and Create.
---
Step 2️⃣ 
+ Setup DynamoDB Tables
   + DynamoDB → Tables → Create table.
   + Table name: `ContactMessages`
   + Partition key: `id` (String)
   + Leave other settings default → Create table.
---
Step 3️⃣ 
+ Create Lambda function (`python 3.12`)
  
  + Go to `AWS Lambda` → Create function.
  + Author from scratch:
  + Function name: `ServerlessContactForm`
  + Runtime: `python 3.12`
  + Architecture: `x86_64` (default is fine)
  + Change default execution role: Use an existing role → select your role e.g `ServerlessContactFormRole`.
  + Click Create function.
  + Replace the contents with your lambda code.

+ Add environment variables

   + In Configuration → Environment variables, add:
   + `UPLOAD_BUCKET` = `YOUR-UPLOADS-BUCKET`
   + `TABLE_NAME` = `ContactMessages`
   + `ALLOWED_ORIGIN` = `*`
     
   > (For production, set to your website origin URL.)
 
+ Increase Lambda timeout
  
  + Configuration → General configuration → Edit:
  + Timeout: set to `10` seconds → Save.
  
---
Step 4️⃣
+ Create the API Gateway HTTP API.
   + Choose HTTP API → Click Build.
   + Configure:
      + Name: `ServerlessContactFormAPI`
     
+ Add an integration
   + Integration target: Lambda Function
   + Select your lambda function. e.g `ServerlessContactForm`

+ Route Settings:

   + Add route → POST /presign → Integration: your Lambda.
   + Add route → POST /submit → Integration: your Lambda.

+ CORS:
  
   + In CORS settings, Enable CORS.
   + Allow origins: `*` 
   > (for dev; later restrict to your website origin).
   + Allow methods: `POST`
   + Allow headers: `Content-Type`

> Deployments: Ensure Auto-deploy is enabled (HTTP APIs usually auto-deploy).

> Note the Invoke URL, e.g. https://abc123.execute-api.us-east-1.amazonaws.com.
    
---
Step 5️⃣ 

+ Frontend (HTML/CSS/JS).  Create a new file on your PC: `index.html` (any folder). 
      
> Update the `API_BASE_URL` value to your `API invoke URL`.

> No external libraries needed; it’s pure HTML/CSS/JS.

+ Upload the frontend
  
   + Go to your website bucket → Objects → Upload → add index.html → Upload.
  
---
# Future Improvements

   + Email notifications via Amazon SES or SNS when a new message arrives.
   + CloudFront in front of your website bucket to get HTTPS and better performance.
   + Validation: add stricter checks (email regex, file type whitelist).
   + TTL (DynamoDB Time To Live) if you want records to expire automatically.



