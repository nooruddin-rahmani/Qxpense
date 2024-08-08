<a href="https://expense.fyi">
<p align="center"><img alt="Expense.fyi – An open source expense tracker application to track your incomes, investments, subscriptions, and expenses at ease." width="100" height="100" src="./public/icons/logo.svg"></p>
  <h1 align="center">Qxpense</h1>
</a>

<p align="center">
  Qxpense is an open-source expense tracker application to effortlessly track and manage your expenses.
</p>



## Introduction

Expense.fyi is an open-source application to effortlessly track and manage your incomes, expenses, investments, and subscriptions.

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [Components](https://ui.shadcn.com/) – ui-components
- [Tailwind](https://tailwindcss.com/) – CSS
- [Supabase](https://supabase.com/) – database
- [Vercel](https://vercel.com/) – hosting
- [Resend](https://resend.com/) – emails

## Implementation

- Expense.fyi is built using [NextJs](https://nextjs.org) from scratch.
- [Postgresql](https://www.postgresql.org/) is used as the ORM for easily communicating with the database for storing user, subscription data, etc. You can refer to the Prisma schema [here](/prisma/schema.prisma).
- [Supabase](https://supabase.com/) is an open-source Firebase alternative, the data is stored in the Postgres database (private data are encrypted) and uses a magic link for authentication provided by supabase.
- [LemonSqueezy](https://lemonsqueezy.com/) is used as the payment system. Its implementation is super simple.


## Author

- Gokulakrishnan Kalaikovan ([@gokul_i](https://twitter.com/gokul_i))

## License

Expense.fyi is an open source under the GNU Affero General Public License Version 3 (AGPLv3) or any later version. 
