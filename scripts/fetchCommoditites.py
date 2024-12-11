import os
import csv
import time
import requests

API_URL = "https://strapi.igs.gg/graphql"
query = """
query Commodities($page: Int!, $pageSize: Int!) {
  commodities(pagination: { page: 20, pageSize: 20 }) {
    meta {
      pagination {
        total
        page
        pageSize
        pageCount
      }
    }
    data {
      id
      attributes {
        name
        image {
          data {
            id
            attributes {
              name
              url
            }
          }
        }
      }
    }
  }
}
"""

# Criar a pasta para salvar imagens
os.makedirs("images", exist_ok=True)

# Abrir o arquivo CSV fora do loop, no modo de acréscimo
with open("commodities.csv", mode="w", newline="", encoding="utf-8") as csv_file:
    writer = csv.writer(csv_file)
    
    # Escrever o cabeçalho do CSV uma única vez
    writer.writerow(["ID", "Item Name", "Name", "Image Name", "Image URL"])

    # Loop para buscar os dados
    for i in range(85, 9637):
      time.sleep(5)
    
      page = i
      page_size = 20

      # Monta a query com f-strings
      query = f"""
      query {{
        commodities(pagination: {{ page: {page}, pageSize: {page_size} }}) {{
          meta {{
            pagination {{
              total
              page
              pageSize
              pageCount
            }}
          }}
          data {{
            id
            attributes {{
              name
              image {{
                data {{
                  id
                  attributes {{
                    name
                    url
                  }}
                }}
              }}
            }}
          }}
        }}
      }}
      """
      print(f"Buscando página {i}...")

      response = requests.post(
        API_URL,
        json={"query": query},
        headers={"Content-Type": "application/json"},
      )
      print(response.json())

      if response.status_code == 200:
          data = response.json()
          commodities = data["data"]["commodities"]["data"]

          for item in commodities:
              commodity_id = item["id"]
              item_name = item["attributes"]["name"]
              attributes = item["attributes"]
              name = attributes["name"]

              # Informações da imagem
              image_data = attributes.get("image", {}).get("data")
              if image_data:
                  image_name = image_data["attributes"]["name"]
                  image_url = image_data["attributes"]["url"]
                  
                  # Salva a imagem localmente
                  img_response = requests.get(image_url)
                  if img_response.status_code == 200:
                      with open(f"/scripts/images/{name}-{image_name}", "wb") as img_file:
                          img_file.write(img_response.content)
              else:
                  image_name = "N/A"
                  image_url = "N/A"

              # Escrever os dados no CSV
              writer.writerow([commodity_id, item_name, f"{name}-{image_name}", image_name, image_url])

      else:
          print(f"Erro ao buscar página {i}: {response.status_code}")
          print(response.text)