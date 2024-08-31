# shopper-desafio-backend

Este repositório contém o teste técnico solicitado para avaliação de habilidades para a posição de Desenvolvedor Web Full-Stack Júnior na Shopper.

## Instruções de Configuração

1. Criar arquivo `.env`

   Exemplo (preencher os campos vazios):

   ```plaintext
   GEMINI_API_KEY=

   ```

2. Instalar o Docker https://www.docker.com/

## Executar:

    docker-compose up --build

## Rotas

    /upload
        Request body:
        {
            "image": "base64",
            "customer_code": "string",
            "measure_datetime": "datetime",
            "measure_type": "WATER" ou "GAS"
        }

    /confirm
        Request body:
        {
            "measure_uuid": "string",
            "confirmed_value": integer
        }


    /<customer code>/list:
    /<customer code>/list?measure_type=WATER

