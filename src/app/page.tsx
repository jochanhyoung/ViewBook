import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/read/clock-angle?sheet=0');
}
