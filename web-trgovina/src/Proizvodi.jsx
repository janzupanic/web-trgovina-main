export default function Proizvodi() {  
    return (
      <div class="min-h-screen flex flex-col bg-gray-100">
       
        <div class="p-6 bg-gray-200">
          <h1 class="text-4xl font-bold text-center text-gray-800">Pretraga proizvoda</h1>
        </div>
  
 
        <div class="flex justify-center p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 class="text-xl font-semibold">Proizvod 1</h2>
              <p class="text-gray-500">Opis proizvoda 1</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 class="text-xl font-semibold">Proizvod 2</h2>
              <p class="text-gray-500">Opis proizvoda 2</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 class="text-xl font-semibold">Proizvod 3</h2>
              <p class="text-gray-500">Opis proizvoda 3</p>
            </div>
          </div>
        </div>
      </div>
    );
  }