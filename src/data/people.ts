export type Gender = "Male" | "Female" | "Other";

export type Person = {
  id: string;
  name: string;
  handle: string;
  gender: Gender;
  pin: string;
  city: string;
  age: number;
  photo: string | null;
  likesYou: boolean;
  replies: string[];
};

export const PEOPLE: Person[] = [
  {
    id: "sandhya",
    name: "Sandhya",
    handle: "B",
    gender: "Female",
    pin: "509124",
    city: "Wanaparthy",
    age: 26,
    photo: "/people/sandhya.jpg",
    likesYou: true,
    replies: [
      "Hi. I saw your note.",
      "Tell me one true thing about your day.",
      "I like calm evenings.",
      "Shall we talk a little more?",
      "I am glad you wrote.",
    ],
  },
  {
    id: "ramu",
    name: "Ramu",
    handle: "C",
    gender: "Male",
    pin: "509125",
    city: "Wanaparthy",
    age: 29,
    photo: null,
    likesYou: true,
    replies: [
      "Hello. How are you?",
      "I am nearby.",
      "What do you like to do on Sunday?",
      "Write again when you are free.",
      "Nice to meet you.",
    ],
  },
  {
    id: "sujatha",
    name: "Sujatha",
    handle: "D",
    gender: "Female",
    pin: "509120",
    city: "Wanaparthy",
    age: 24,
    photo: null,
    likesYou: true,
    replies: [
      "Namaste.",
      "I just got home.",
      "Do you live near this PIN?",
      "I can talk in the evening.",
      "Thank you for the message.",
    ],
  },
  {
    id: "karthik",
    name: "Karthik",
    handle: "E",
    gender: "Male",
    pin: "509130",
    city: "Pebbair",
    age: 31,
    photo: null,
    likesYou: false,
    replies: [
      "Hi.",
      "Maybe later.",
      "I am at work.",
      "Tell me more.",
      "Ok.",
    ],
  },
  {
    id: "ananya",
    name: "Ananya",
    handle: "F",
    gender: "Female",
    pin: "520001",
    city: "Vijayawada",
    age: 23,
    photo: "/people/ananya.jpg",
    likesYou: false,
    replies: [
      "Hello from another city.",
      "I travel sometimes.",
      "What is your PIN area like?",
      "Nice to read your bio.",
      "Talk soon.",
    ],
  },
];

export function personById(id: string): Person | undefined {
  return PEOPLE.find((person) => person.id === id);
}
