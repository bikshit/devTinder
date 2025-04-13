const express = require("express");

const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const { validateEditProfileData } = require("../utils/validation");

const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;
    const isValidPassword = await loggedInUser.validatePassword(oldPassword);
    if (isValidPassword) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      loggedInUser.password = newHashedPassword;
      await loggedInUser.save();
      res.json({
        message: "Password updated successfully",
        data: loggedInUser,
      });
    } else {
      throw new Error("Invalid old password");
    }
  } catch (err) {
    res.status(500).send("Something went wrong: " + err.message);
  }
});

module.exports = profileRouter;
