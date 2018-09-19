## Setup

1. install node
2. run `npm install`

## Generate diff report

1. create `.env` file (see `.sample.env`)
2. create folders `reports/$PROJECT_ID`
3. create folders `reports/$PROJECT_ID/$MASTER_MOV/stripes/` and `/reports/$PROJECT_ID/$SCAN_MOV/stripes/`; copy frame sprites to these folder accordingly
4. run `npm run bundle -- --projectId $PROJECT_ID --comparedMov $SCAN_MOV` (i.e. ` --projectId salt_color_trim3k --comparedMov salt_dc_color_trim3k.mov`)
