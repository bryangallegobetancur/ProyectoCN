import csv
import json
import re
import urllib.parse
from datetime import datetime

# Si se despliega en AWS, se usa boto3 para leer de S3.
# Si no está disponible (ej. localmente), simulamos la lectura.
try:
    import boto3
    s3_client = boto3.client('s3')
except ImportError:
    s3_client = None


def validate_record(row):
    """
    Valida un registro individual del CSV.
    Retorna (es_valido, error_mensaje, datos_limpios)
    """
    id_transaccion = row.get('id_transaccion', '').strip()
    cliente = row.get('cliente', '').strip()
    monto_raw = row.get('monto', '').strip()
    fecha_raw = row.get('fecha', '').strip()

    # 1. Validar ID de Transacción
    if not id_transaccion:
        return False, "ID de transacción vacío", None

    # 2. Validar Cliente
    if not cliente:
        return False, "Cliente vacío", None

    # 3. Validar Monto
    try:
        monto = float(monto_raw)
        if monto < 0:
            return False, f"Monto negativo ({monto})", None
    except ValueError:
        return False, f"Monto no numérico ({monto_raw})", None

    # 4. Validar Fecha (debe ser YYYY-MM-DD)
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', fecha_raw):
        return False, f"Formato de fecha inválido ({fecha_raw}), debe ser YYYY-MM-DD", None
    
    try:
        datetime.strptime(fecha_raw, '%Y-%m-%d')
    except ValueError:
        return False, f"Fecha inválida ({fecha_raw})", None

    # Si todo es correcto, retornar el registro limpio estructurado
    return True, None, {
        "id_transaccion": id_transaccion,
        "cliente": cliente,
        "monto": monto,
        "fecha": fecha_raw
    }


def process_csv_content(csv_content):
    """
    Procesa el contenido en texto de un CSV y separa registros válidos de anomalías.
    """
    lines = csv_content.splitlines()
    reader = csv.DictReader(lines)
    
    processed = []
    anomalies = []

    for index, row in enumerate(reader, start=2): # fila 1 es el header
        # Si la fila está vacía, saltarla
        if not any(row.values()):
            continue
            
        es_valido, error_msg, clean_data = validate_record(row)
        if es_valido:
            processed.append(clean_data)
        else:
            anomalies.append({
                "fila": index,
                "datos_originales": row,
                "motivo": error_msg
            })

    return processed, anomalies


def lambda_handler(event, context):
    """
    Función Lambda principal para procesamiento, validación y alertas.
    Soporta eventos S3 (ingesta automatizada) y llamadas HTTP API Gateway (simulación).
    """
    print("Evento recibido:", json.dumps(event, indent=2))
    
    csv_content = ""
    source = "desconocido"
    
    try:
        # Escenario 1: Invocado por un evento de AWS S3 (Ingesta reactiva)
        if 'Records' in event and event['Records'][0].get('eventSource') == 'aws:s3':
            source = "AWS S3"
            bucket = event['Records'][0]['s3']['bucket']['name']
            key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
            
            if not s3_client:
                raise Exception("Boto3 no está configurado o S3 client no pudo inicializarse.")
                
            response = s3_client.get_object(Bucket=bucket, Key=key)
            csv_content = response['Body'].read().decode('utf-8')
            print(f"Archivo leido exitosamente desde S3: {bucket}/{key}")
            
        # Escenario 2: Invocado por API Gateway / Petición directa (Simulación / Demo)
        elif 'body' in event:
            source = "API Gateway"
            # Manejar si el body es un string JSON o texto plano
            body = event['body']
            if isinstance(body, str):
                try:
                    body_json = json.loads(body)
                    csv_content = body_json.get('csv_data', '')
                except json.JSONDecodeError:
                    csv_content = body
            else:
                csv_content = body.get('csv_data', '') if isinstance(body, dict) else ""
        
        # Escenario 3: Entrada directa en el evento (Pruebas unitarias directas)
        elif 'csv_data' in event:
            source = "Invocación Directa"
            csv_content = event['csv_data']
            
        else:
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({
                    "success": False,
                    "error": "Formato de evento no soportado. Debe ser un evento S3, API Gateway con 'body' o contener 'csv_data'."
                })
            }

        if not csv_content.strip():
            return {
                "statusCode": 400,
                "headers": {"Content-Type": "application/json"},
                "body": json.dumps({
                    "success": False,
                    "error": "El contenido del archivo CSV está vacío."
                })
            }

        # Procesar los datos
        validos, anomalias = process_csv_content(csv_content)
        
        # Aquí se simularía la persistencia (ej. DynamoDB) y alertas (ej. SNS)
        alertas_enviadas = len(anomalias) > 0
        
        resultado = {
            "success": True,
            "origen": source,
            "resumen": {
                "total_procesados": len(validos) + len(anomalias),
                "validos": len(validos),
                "anomalias": len(anomalias)
            },
            "registros_validos": validos,
            "anomalias_detectadas": anomalias,
            "alertas_disparadas": alertas_enviadas
        }

        # Retornar código 200 en éxito
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" # Habilitar CORS para pruebas desde frontend
            },
            "body": json.dumps(resultado, indent=2)
        }

    except Exception as e:
        print(f"Error procesando el pipeline: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "success": False,
                "error": f"Error interno en la ejecución del pipeline: {str(e)}"
            })
        }
