# CryptoBrokers WAVESGUI Port

Dependencies
- [x] Port @turtlenetwork/signature-adapter
- [x] Port @turtlenetwork/waves-transactions
- [ ] Port @turtlenetwork/data-service
  - [x] Change first seeded asset to TN
  - [x] Run using PostgreSQL DB with data from TN Network
  - [ ] Verify correct asset-pair discovery
  - [ ] Generate Candles
- [x] Check compatibility of blockchain-postgres-sync with TN
  - [x] Downloads transactions
- [x] Fix hashing to be compatible with Testnet (Byte 108)
- [ ] Fix Data-service to generate candlesticks
- [ ] Fix bug where data-services without api path `/v0` will not work (config.ts)
- [x] Check compatibility with TN Matcher

Wallet
- [x] Change Base currency to TN
- [ ] Account Creation
  - [ ] Import accounts
    - [x] Use existing seed
    - [x] Use Private Key
    - [ ] Use keystore file
    - [ ] Use ledger device
    - [ ] Waves Keeper?
  - [x] Creating Account
    - [x] Generate a Account with new account address
- [ ] Transactions
  - [x] Show Balance
  - [x] Send TN
  - [ ] Send other Assets
  - [x] Receive TN
  - [x] Show Transactions
  - [ ] Show all assets
  - [ ] Mass Transfer
  - [ ] Receive via QR Code
  - [ ] Generating invoice?
  - [ ] Send via QR Code
- [ ] Allow for seeds that are not 15 words

Exchange
- [ ] Change default currency to TN

Technical Debt/Hard coded
- [ ] Change WelcomeCtrl.js to load correct asset pairs
- [ ] Fix mixing of pulling config from local config and .git config


Aesthetic
- [ ] Remove header notifying of moving of Waves DEX
- [ ] Fix labelling


Infrastructure
- [ ] Design Kubernetes architecture to run GUI
- [ ] Write Ansible Playbooks for hardened hosts designs


Bugs to Fix
- [ ] Fix verification of transactions on send (waves-send.html)

```javascript
<div class="margin-top-3">
    <w-sign-button on-click="$ctrl.createTx()"
                   on-success="$ctrl.onSignTx(signable)"
                   disabled="$ctrl.wavesSend.$invalid || !$ctrl.hasFee">
```

Notes:

- Data-service in waves is deployed behind some external version controlling proxy
- Environment variables on windows need to be exported locally 

## How to run

Deploy Postgres
docker run -d -p 5432:5432 --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword postgres:latest

https://medium.com/better-programming/connect-from-local-machine-to-postgresql-docker-container-f785f00461a7


From the blockchain-postgres-sync run

`npm run migrate -- --connection postgresql://postgres:mysecretpassword@localhost:5432/tndb`

`npm run updateComposite`

From Dataservice
export $(cat variables.env | xargs) && NODE_ENV=production node dist/index.js

Fees
> Config/{environment}/feeConfigUrl

