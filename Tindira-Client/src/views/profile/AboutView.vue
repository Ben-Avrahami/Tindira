<template>
  <article class="flex flex-col items-center justify-center p-8 gap-5 text-center">
    <ViewTitle>About Us</ViewTitle>
    <section>
      <p class="text-lg leading-relaxed">
        <b> Tindira: Your Next Home, A Swipe Away​</b>
      </p>
    </section>
    <section>
      <h2 class="text-3xl font-semibold mb-6">Our Vision</h2>
      <p class="text-lg leading-relaxed">
        Tindira is a mobile application that aims to streamline the apartment hunting process by enabling users to swipe left or right on apartment listings,
        similar to today's popular dating apps. The app fills a gap in the current market by providing
        a user-friendly interface to filter and browse available apartments based on location, price, size, and other preferences.​
      </p>
    </section>
    <section>
      <h2 class="text-3xl font-semibold mb-6">Why Us?</h2>
      <p class="text-lg leading-relaxed">
        Our mission is to create innovative solutions that empower users to find their dream apartments and help 
        apartment owners connect with their ideal tenants. We are dedicated to providing the best user experience by
        focusing on performance, design, and usability.
      </p>
    </section>
    <Divider />
    <section>
      <h2 class="text-3xl font-semibold mb-8 text-center">Meet the Team</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card v-for="(member, index) in team" :key="index">
          <template #header>
            <img
              :src="member.image"
              :alt="member.name"
              class="w-32 h-32 mx-auto rounded-full mb-4"
            />
          </template>
          <template #title>
            <h3 class="text-xl font-bold text-center">{{ member.name }}</h3>
          </template>
          <template #subtitle>
            <p class="text-2xl font-bold text-center">{{ member.role }}</p>
          </template>
          <template #content>
            <p>{{ member.description }}</p>
          </template>
        </Card>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ViewTitle from '@/components/misc/ViewTitle.vue'

interface TeamMember {
  name: string
  role: string
  description: string
  image: string
}

const team = ref<TeamMember[]>([
  {
    name: 'Ben Avrahami',
    role: 'Front End Developer',
    description:
      'Ben is a dedicated developer with a passion for creating beautiful and responsive user interfaces.',
    image: 'https://tindira.s3.us-east-2.amazonaws.com/users/bens/cropped_image+(4).png'
  },
  {
    name: 'Yoni Simian',
    role: 'Front End Developer',
    description: 'Yoni is a skilled developer with a keen eye for detail and design.',
    image: 'https://tindira.s3.us-east-2.amazonaws.com/users/yonisimian/yoni.png'
  },
  {
    name: 'Mor Simha​',
    role: 'Back End Developer',
    description:
      'Mor is a talented developer with a strong passion for building scalable and efficient applications.',
    image: 'https://tindira.s3.us-east-2.amazonaws.com/users/morty/morty.png'
  },
  {
    name: 'Gal Ben Artzi',
    role: 'Back End Developer',
    description:'Gal is a proficient developer who excels at integrating complex systems and ensuring seamless backend operations.',
    image: 'https://tindira.s3.us-east-2.amazonaws.com/users/galben/galben.png'
  },
  {
    name: 'Omer Komissrachik',
    role: 'Back End Developer',
    description:' Omer is an enthusiastic developer who is dedicated to creating seamless and efficient backend systems.',
    image: 'https://tindira.s3.us-east-2.amazonaws.com/users/omer/omer.png'
  },
])
</script>

<style scoped></style>
