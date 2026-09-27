import fs from "node:fs"

const inputPath = "./temp/barangays.geojson"
const outputPath = "./src/data/morong-barangays.geojson"

const morongPSGC = new Set([
  "0300808001", // Binaritan
  "0300808002", // Mabayo
  "0300808003", // Nagbalayong
  "0300808004", // Poblacion
  "0300808005", // Sabang
])

const raw = fs.readFileSync(inputPath, "utf8")
const geojson = JSON.parse(raw)

console.log(`Loaded ${geojson.features.length} barangays.`)

// First inspect the properties so we know the exact
// PSGC field used by this particular dataset.
console.log("Sample properties:")
console.log(geojson.features[0]?.properties)

const possibleCodeFields = [
  "psgc_code",
  "PSGC_CODE",
  "psgc",
  "PSGC",
  "code",
  "CODE",
  "pcode",
  "PCODE",
]

function getPSGC(feature) {
  for (const field of possibleCodeFields) {
    const value = feature.properties?.[field]

    if (value !== undefined && value !== null) {
      const code = String(value).trim()

      if (morongPSGC.has(code)) {
        return code
      }
    }
  }

  return null
}

const features = geojson.features.filter(
  (feature) => getPSGC(feature) !== null
)

console.log(`Found ${features.length} Morong barangays.`)

for (const feature of features) {
  console.log(
    getPSGC(feature),
    feature.properties
  )
}

if (features.length !== 5) {
  console.error(
    `Expected 5 barangays but found ${features.length}.`
  )

  console.error(
    "Look at 'Sample properties' above and tell me what you see."
  )

  process.exit(1)
}

const result = {
  type: "FeatureCollection",
  features,
}

fs.writeFileSync(
  outputPath,
  JSON.stringify(result, null, 2)
)

console.log(`Created ${outputPath}`)