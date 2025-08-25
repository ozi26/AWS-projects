import boto3
import json
from decimal import Decimal
from datetime import datetime
import uuid

dynamodb = boto3.resource('dynamodb')
counter_table = dynamodb.Table('VisitorCounter')
logs_table = dynamodb.Table('VisitorLogs')

def lambda_handler(event, context):
    try:
        # Get user-agent and IP from request headers
        headers = event.get('headers', {})
        user_agent = headers.get('User-Agent', 'Unknown')
        ip_address = event.get('requestContext', {}).get('http', {}).get('sourceIp', 'Unknown')

        # Update visitor count
        counter_response = counter_table.update_item(
            Key={'id': 'counter'},
            UpdateExpression='SET #c = if_not_exists(#c, :start) + :inc',
            ExpressionAttributeNames={'#c': 'count'},
            ExpressionAttributeValues={':inc': 1, ':start': 0},
            ReturnValues="UPDATED_NEW"
        )

        count = int(counter_response['Attributes']['count'])
        timestamp = datetime.utcnow().isoformat() + 'Z'

        # Log this visit
        logs_table.put_item(
            Item={
                'visit_id': str(uuid.uuid4()),
                'timestamp': timestamp,
                'ip_address': ip_address,
                'user_agent': user_agent
            }
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'visitor_count': count,
                'timestamp': timestamp
            })
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal Server Error', 'details': str(e)})
        }
