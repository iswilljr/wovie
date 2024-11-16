import { defineDb, defineTable, column, NOW } from 'astro:db'

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    emailVerified: column.boolean(),
    isAnonymous: column.boolean({ optional: true }),
    image: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    expiresAt: column.date(),
    ipAddress: column.text({ optional: true }),
    userAgent: column.text({ optional: true }),
    userId: column.text({ references: () => User.columns.id }),
  },
})

const Account = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    accountId: column.text(),
    providerId: column.text(),
    userId: column.text({ references: () => User.columns.id }),
    accessToken: column.text({ optional: true }),
    refreshToken: column.text({ optional: true }),
    idToken: column.text({ optional: true }),
    expiresAt: column.date({ optional: true }),
    password: column.text({ optional: true }),
  },
})

const Verification = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    identifier: column.text(),
    value: column.text(),
    expiresAt: column.date(),
  },
})

const KeepWatching = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    mediaId: column.number(),
    mediaType: column.text(),
    mediaData: column.json(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    userId: column.text({ references: () => User.columns.id }),
  },
})

export default defineDb({
  tables: {
    User,
    Session,
    Account,
    Verification,
    KeepWatching,
  },
})
