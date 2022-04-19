import { hash } from 'bcrypt';
import { User } from '../models/user';
import { AuthenticationType } from '../models/user';

const createUser = async (email: string, password: string) => {
  const saltRounds = 10;
  const hashedPassword = await hash(password, saltRounds);
  if (!hashedPassword) {
    console.log('Error hashing password');
    return null;
  }
  const newUser = new User({
    accountType: AuthenticationType.Internal,
    email: email,
    password: hashedPassword,
    admin: false,
  });
  const user = await newUser.save();
  return user;
};

const getUserFromDB = async (email: string) => {
  const user = await User.findOne({ email: email }).exec();
  return user;
};

const getAllUsersFromDB = async () => {
  const userList = await User.find({});
  return userList;
};

/**
 * A function that upgrades a certain user to an admin.
 * @param email
 * @returns A boolean indicating whether the upgrade was successful or not
 */
const upgradeToAdmin = async (email: string) => {
  const user = await User.findOne({ email: email }).exec();
  if (user) {
    if (user.admin) {
      return false;
    }
    user.admin = !user.admin;
    const newUser = await user.save();
    return true;
  } else {
    return false;
  }
};

const deleteOne = async (email: string) => {
  const user = User.findByIdAndRemove({ email: email });
  return user;
};

export {
  createUser,
  getUserFromDB,
  getAllUsersFromDB,
  upgradeToAdmin,
  deleteOne,
};
