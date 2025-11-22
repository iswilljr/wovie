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
    token: column.text({ optional: true, unique: true }),
    ipAddress: column.text({ optional: true }),
    userAgent: column.text({ optional: true }),
    userId: column.text({ references: () => User.columns.id }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
  indexes: [
    {
      on: ['userId'],
    },
  ],
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
    accessTokenExpiresAt: column.date({ optional: true }),
    refreshTokenExpiresAt: column.date({ optional: true }),
    expiresAt: column.date({ optional: true, deprecated: true }),
    scope: column.text({ optional: true }),
    password: column.text({ optional: true }),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
  indexes: [
    {
      on: ['userId'],
    },
  ],
})

const Verification = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    identifier: column.text(),
    value: column.text(),
    expiresAt: column.date(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
  },
})

const Watching = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    runtime: column.number(),
    watchedTime: column.number(),
    episode: column.number(),
    mediaId: column.number(),
    mediaType: column.text(),
    season: column.number(),
    sourceId: column.text(),
    details: column.json(),
    createdAt: column.date({ default: NOW }),
    updatedAt: column.date({ default: NOW }),
    userId: column.text({ references: () => User.columns.id }),
  },
  indexes: [
    {
      on: ['userId', 'mediaId', 'mediaType'],
      unique: true,
    },
    {
      on: ['userId'],
    },
  ],
})

const Watchlist = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    mediaId: column.number(),
    mediaType: column.text(),
    details: column.json(),
    createdAt: column.date({ default: NOW }),
    userId: column.text({ references: () => User.columns.id }),
  },
  indexes: [
    {
      on: ['userId', 'mediaId', 'mediaType'],
      unique: true,
    },
    {
      on: ['userId'],
    },
  ],
})

export default defineDb({
  tables: {
    User,
    Session,
    Account,
    Verification,
    Watching,
    Watchlist,
  },
})
