<template>
  <article class="flex flex-col items-center justify-center p-8 text-justify gap-5">
    <section>
      <h1 class="text-4xl font-bold mb-4 text-center">Why Us?</h1>
      <p class="text-lg leading-relaxed">
        Our application is built with cutting-edge technology to provide the best user experience.
        We focus on performance, design, and usability to ensure that our users have the best
        experience possible.
      </p>
    </section>
    <Divider />
    <section>
      <h2 class="text-3xl font-semibold mb-6 text-center">Our Mission</h2>
      <p class="text-lg leading-relaxed">
        Our mission is to create innovative solutions that empower our users to achieve their goals.
        We strive to provide the best user experience by focusing on performance, design, and
        usability.
      </p>
    </section>
    <section>
      <h2 class="text-3xl font-semibold mb-6 text-center">Our Vision</h2>
      <p class="text-lg leading-relaxed">
        Our vision is to be the leading provider of cutting-edge technology solutions that enhance
        the lives of our users. We aim to create a positive impact on the world by providing
        innovative solutions that empower our users to achieve their goals.
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

interface TeamMember {
  name: string
  role: string
  description: string
  image: string
}

const team = ref<TeamMember[]>([
  {
    name: 'Alice Johnson',
    role: 'CEO & Founder',
    description:
      'Alice is the visionary behind our company with a passion for technology and innovation.',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'Bob Smith',
    role: 'Lead Developer',
    description: 'Bob is our lead developer with extensive experience in full-stack development.',
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Catherine Lee',
    role: 'UI/UX Designer',
    description:
      'Catherine designs intuitive user interfaces that ensure a seamless user experience.',
    image: 'https://randomuser.me/api/portraits/women/3.jpg'
  }
])
</script>

<style scoped></style>
