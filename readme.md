
# Extracción usuarios-nodos plataforma banner



## Componentes utilizados
- nodejs
- oracledb
- aws-sdk

Este proyecto alojado en una lambda de AWS. extrae usuarios desde una base de datos, para luego buscar esos usuarios en una api externa de otro proveedor, finalmente, los resultados son almacenados en un S3 DE AWS para su posterior revisión.

