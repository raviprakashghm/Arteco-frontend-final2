const { supabase } = require('./db.js');

const legacyProducts = [
  { name: "T Scale", image: "/assets/t-scale.jpg", id: "t-scale", category: "stationery", price: 350, description: "Professional T-Scale for architectural drafting" },
  { name: "Triangular Scale", image: "/assets/triangular-scale.jpg", id: "triangular-scale", category: "stationery", price: 280, description: "Triangular scale ruler" },
  { name: "Set Square", image: "/assets/set-square.jpg", id: "set-square", category: "stationery", price: 320, description: "Quality set squares" },
  { name: "Micro Pens", image: "/assets/micro-pens.jpg", id: "micro-pens", category: "stationery", price: 224, description: "Precision micro pens" },
  { name: "Cutting Mat", image: "/assets/cutting-mat.jpg", id: "cutting-mat", category: "stationery", price: 450, description: "A3 Self-healing cutting mat" },
  { name: "Thermocol Sheet", image: "/assets/thermocol-sheet.jpg", id: "thermocol-sheet", category: "stationery", price: 180, description: "Standard thermocol sheets" },
  { name: "A1 Imperial Sheet", image: "/assets/a1-sheet.jpg", category: "sheets", price: 50, description: "Standard A1 size architectural sheet" },
  { name: "A2 Half Imperial", image: "/assets/a2-sheet.jpg", category: "sheets", price: 30, description: "Standard A2 size architectural sheet" },
  { name: "A3 Quarter Imperial", image: "/assets/a3-sheet.jpg", category: "sheets", price: 20, description: "Standard A3 size architectural sheet" },
  { name: "Gateway Sheet", image: "/assets/gateway-sheet.jpg", category: "sheets", price: 15, description: "Premium tracing gateway sheet" },
  { name: "Cartridge Sheet", image: "/assets/cartridge-sheet.jpg", category: "sheets", price: 25, description: "Thick cartridge sheet for rendering" },
  { name: "Butter Paper", image: "/assets/butter-paper.jpg", category: "sheets", price: 5, description: "Basic tracing butter paper" },
  { name: "AutoCAD Basics", image: "/assets/autocad.jpg", category: "courses", price: 2500, description: "Master the fundamentals of 2D drafting and planning" },
  { name: "SketchUp Pro", image: "/assets/sketchup.jpg", category: "courses", price: 3000, description: "Learn 3D modeling and massing for architecture" },
  { name: "Revit Architecture", image: "/assets/revit.jpg", category: "courses", price: 4500, description: "Comprehensive BIM modeling and documentation" },
  { name: "Lumion Rendering", image: "/assets/lumion.jpg", category: "courses", price: 3500, description: "Create photorealistic renders and walkthroughs" }
];

async function seed() {
  console.log("Seeding " + legacyProducts.length + " products to Supabase direct...");
  const { data, error } = await supabase.from('products').insert(legacyProducts).select();
  if (error) {
     console.error("Error inserting:", error.message);
  } else {
     console.log("Finished seeding. Successful:", data.length);
  }
}

seed();
