
set -e
curl -L "$1/admin/sitemap.xml?origin=$2" -o $3/sitemap.xml