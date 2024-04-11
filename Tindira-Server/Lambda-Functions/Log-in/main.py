import json

health_path = '/health'
register_path = '/register'
login_path = '/login'
verify_path = '/verify'

def lambda_handler(event, context):
    print("Request Event: ", event)
    response = None
    
    if event['httpMethod'] == 'GET' and event['path'] == health_path:
        response = build_response(200, event['path'])
    elif event['httpMethod'] == 'POST' and event['path'] == register_path:
        response = build_response(200, event['path'])
    elif event['httpMethod'] == 'POST' and event['path'] == login_path:
        response = build_response(200, event['path'])
    elif event['httpMethod'] == 'POST' and event['path'] == verify_path:
        response = build_response(200, event['path'])
    else:
        response = build_response(400, "404 Not Found")
    
    return response

def build_response(status_code, path=None):
    response = {
        'statusCode': status_code,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    }
    if path is not None:
        path = "&&" + path.upper() + "&&"
        response['body'] = json.dumps({'path': path})
    return response
