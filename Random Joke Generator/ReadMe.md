What you’ll build

Architecture (high level)

[Browser Frontend] --GET--> [API Gateway HTTP API] --invokes--> [AWS Lambda]
                                                  \--fetches--> https://official-joke-api.appspot.com/random_joke


Frontend: A single HTML file with a “Get Joke” button.

Backend: AWS Lambda (Node.js 20) that fetches from the public joke API.

API layer: API Gateway (HTTP API) exposes a GET /joke endpoint.

CORS: Enabled so your browser can call the API.

Prerequisites (Windows)

An AWS account (free tier is fine).

A modern browser (Chrome/Edge/Firefox).

(Optional but handy) Python 3 installed so you can run a tiny local web server:
In PowerShell: python --version → if missing, download from python.org.

(Optional) VS Code to edit files comfortably.

We’ll use the AWS Console for everything. No command line required.

Step 1 — Create the IAM role for Lambda

Sign in to the AWS Management Console.

Open IAM → Roles → Create role.

Trusted entity type: AWS service.
Use case: Choose Lambda → Next.

Permissions: Search and attach AWSLambdaBasicExecutionRole
(This lets Lambda write logs to CloudWatch).

Role name: lambda-joke-role → Create role.

Step 2 — Create the Lambda function (Node.js 20)

Go to AWS Lambda → Create function.

Author from scratch:

Function name: random-joke-lambda

Runtime: Node.js 20.x

Architecture: x86_64 (default is fine)

Change default execution role: Use an existing role → select lambda-joke-role

Click Create function.

Add the code

In the code editor (index.mjs or index.js area), replace the contents with:
