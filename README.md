# Surgery Status Board

<img width="1422" height="585" alt="Screenshot of homepage" src="https://github.com/user-attachments/assets/1cc9adf6-92ac-4c69-aa65-da4f06993b5c" />
<img  width="340" height="500" alt="Screenshot of patient statuses" src="https://github.com/user-attachments/assets/50dfc066-e6cd-4200-b88d-c64526a5e44d"/>

**Surgery Status Board** is a web application designed to help ease the stress of loved ones waiting during a patient’s surgery. The app allows surgery center personnel to collect patient information and update their progress throughout each phase of the procedure. This information can be displayed on a monitor in the waiting room, giving family and friends visibility into the surgery workflow and helping them stay informed and reassured.

# Key Features
- Responsive website 
- Staff Login/Logout 
- Guests can view patient status updates 
- Surgery Team Members can update surgery status
- Admins can add/update patient information and surgery status

# Built with
- Language: TypeScript
- Frontend: React, Next.js, Tailwind CSS, shadcn/ui 
- Backend-as-a-Service / Database: Supabase

# Setup
1. Clone the project into local directory
```
https://github.com/chingu-voyages/V56-tier3-team-38.git
```
2. Navigate to surgical-app folder
```
cd surgical-app
```
3. Install dependencies
```
npm install
```
4. Create a .env.local file and include your own `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` Supabase credentials
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
5. Create the `patients` table in the Supabase SQL Editor

```
  create table patients (
  id text not null,
  first_name text not null,
  last_name text not null,
  street_address text not null,
  city text not null,
  state text not null,
  country text not null,
  telephone text not null,
  email text not null,
  status text not null default 'Checked In'::text,
  created_at timestamp with time zone null default now(),
  constraint patients_pkey primary key (id)
);
```

6. Start the server with the command below and open `http://localhost:3000` to view it in your browser
```
npm run dev
```

# Our Team

- Tomoyuki Kishi: [GitHub](https://github.com/kishi1997) / [LinkedIn](https://linkedin.com/in/kishi-tomoyuki-287b39355/)
- Johnny Kim: [GitHub](https://github.com/bellhwi) / [LinkedIn](https://www.linkedin.com/in/jonghwikim/)
- Lisa Chan: [GitHub](https://github.com/lc1715) / [LinkedIn](http://www.linkedin.com/in/lisa-chan14)
- Delanshia Hamilton: [GitHub](https://github.com/LanceHam) 
