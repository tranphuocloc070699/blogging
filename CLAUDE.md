Now I want to push to VPS.
1. THis is docker command
docker run -d \
  --name postgres-blog \
  -e POSTGRES_DB=blog \
  -e POSTGRES_USER=blog-user \
  -e POSTGRES_PASSWORD=blog-pass \
  -p 5432:5432 \
  postgres:latest

2. This is minio
docker run -d \
  --name minio \
  -p 9000:9000 -p 9001:9001 \
  -v /path/to/local/data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=password123" \
  minio/minio server /data --console-address ":9001"

then run command to install minio command
curl -O https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
then open for bucket 
mc anonymous set download local/[bucket name]
let choose blogging is bucket name.

3. use nginx toi manage traffic,SSL certifications.

4. Add CI/CD for github
5. I am still not init git in this repo, let init, create .env.example, and ignore important files

If you want to ask any question, just do