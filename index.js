const GxCertWriter = require("gxcert-write");
const Web3 = require("web3");
const fs = require("fs");

function createServer(rpcHost, contractAddress, privateKey, common, allowedOrigins) {
  const web3 = new Web3(rpcHost);
  async function init() {
    await writer.init();
  }

  const writer = new GxCertWriter(web3, contractAddress, privateKey, common);
  const writerAccount = web3.eth.accounts.privateKeyToAccount(privateKey);

  function initializeExpress() {
    const express = require("express");
    const app = express();
    const bodyParser = require("body-parser");
    app.use(bodyParser.json());
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      res.header('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', true);
      return next();
    });
    app.post("/cert", (req, res) => {
      const signed = req.body;
      writer.createCert(writerAccount.address, signed).then((transactionHash) => {
        res.status(201).json({
          transactionHash,
          message: "Successfully posted the certificate.",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.post("/userCert", (req, res) => {
      const signed = req.body;
      writer.createUserCert(writerAccount.address, signed).then((transactionHash) => {
        res.status(201).json({
          transactionHash,
          message: "Successfully posted the certificate.",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.post("/userCerts", (req, res) => {
      const signedObjects = req.body;
      writer.createUserCerts(writerAccount.address, signedObjects).then((transactionHash) => {
        res.status(201).json({
          message: "Successfully posted the certificate.",
          transactionHash,
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.post("/profile", (req, res) => {
      const { address, signedProfile } = req.body;
      writer.createProfile(
        writerAccount.address, 
        address, 
        signedProfile
      ).then((transactionHash) => {
        res.status(201).json({
          transactionHash,
          message: "Successfully created new profile.",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.put("/profile", (req, res) => {
      const signedProfile = req.body;
      writer.updateProfile(
        writerAccount.address, 
        signedProfile
      ).then((transactionHash) => {
        res.status(201).json({
          transactionHash,
          message: "Successfully created new profile.",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.post("/group", (req, res) => {
      const group = req.body;
      writer.createGroup(writerAccount.address, group).then((transactionHash) => {
        res.status(201).json({
          transactionHash,
          message: "Successfully created the group",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.put("/group", (req, res) => {
      const signedGroup = req.body;
      writer.updateGroup(writerAccount.address, signedGroup).then((transactionHash) => {
        res.status(201).json({
          transactionHash,
          message: "Successfully created the group",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.post("/disable", (req, res) => {
      const { groupId, signedAddress } = req.body;
      writer.disableGroupMember(writerAccount.address, groupId, signedAddress).then((transactionHash) => {
        res.status(200).json({
          transactionHash,
          message: "Successfully invited the member.",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.post("/invite", (req, res) => {
      const { groupId, signedAddress } = req.body;
      writer.inviteMemberToGroup(writerAccount.address, groupId, signedAddress).then((transactionHash) => {
        res.status(200).json({
          transactionHash,
          message: "Successfully invited the member.",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    app.post("/invalidate", (req, res) => {
      const signedUserCert = req.body;
      writer.invalidateUserCert(writerAccount.address, signedUserCert).then((transactionHash) => {
        res.status(200).json({
          transactionHash,
          message: "Successfully invited the member.",
        });
      }).catch(err => {
        res.status(500).json({
          error: err.message,
        });
      });
    });
    return app;
  }

  init();
  const app = initializeExpress();
  return app;
}

module.exports = createServer;

