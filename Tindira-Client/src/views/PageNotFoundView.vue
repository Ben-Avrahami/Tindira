<template>
  <div class="flex flex-col justify-center h-full w-[95%] mx-auto">
    <div class="flex flex-col text-center justify-center">
      <h1 class="text-6xl font-bold text-gray-800">404</h1>
      <p class="mt-2 text-xl font-semibold text-gray-600">Page Not Found</p>
      <p class="mt-4 text-gray-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <RouterLink to="/">
        <Button label="Go Back Home" class="mt-6" />
      </RouterLink>
    </div>
  </div>
</template>
