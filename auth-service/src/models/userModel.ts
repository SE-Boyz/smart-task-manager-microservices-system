import mongoose from 'mongoose'

export interface UserRecord {
  id: string
  name: string
  email: string
  password: string
}

type PublicUser = Omit<UserRecord, 'password'>

const userSchema = new mongoose.Schema<UserRecord>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    collection: 'users',
  },
)

const User = mongoose.models.User || mongoose.model<UserRecord>('User', userSchema)

export async function createUser(user: UserRecord) {
  const createdUser = await User.create(user)
  return createdUser.toObject({ versionKey: false })
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email }).select('-_id').lean<UserRecord | null>()
}

export async function findUserById(id: string) {
  return User.findOne({ id }).select('-_id -password').lean<PublicUser | null>()
}
