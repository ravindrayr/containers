/**
 * TDD: Upload Directory Tests
 * Validates the uploads folder and sample files exist and are ready
 */

const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(__dirname, "../uploads");

describe("Uploads Directory", () => {
  test("uploads/ directory exists", () => {
    expect(fs.existsSync(UPLOADS_DIR)).toBe(true);
  });

  test("uploads/ directory is not empty", () => {
    const files = fs.readdirSync(UPLOADS_DIR).filter((f) => f !== ".gitkeep");
    expect(files.length).toBeGreaterThan(0);
  });

  test("sample.txt exists in uploads/", () => {
    const filePath = path.join(UPLOADS_DIR, "sample.txt");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("sample.txt is not empty", () => {
    const filePath = path.join(UPLOADS_DIR, "sample.txt");
    const content = fs.readFileSync(filePath, "utf8");
    expect(content.trim().length).toBeGreaterThan(0);
  });
});

describe("Docker Configuration", () => {
  test("Dockerfile exists", () => {
    expect(fs.existsSync(path.join(__dirname, "../Dockerfile"))).toBe(true);
  });

  test("docker-compose.yml exists", () => {
    expect(fs.existsSync(path.join(__dirname, "../docker-compose.yml"))).toBe(true);
  });

  test("upload.sh exists", () => {
    expect(fs.existsSync(path.join(__dirname, "../upload.sh"))).toBe(true);
  });

  test(".env file exists", () => {
    expect(fs.existsSync(path.join(__dirname, "../.env"))).toBe(true);
  });

  test(".env.example exists for team onboarding", () => {
    expect(fs.existsSync(path.join(__dirname, "../.env.example"))).toBe(true);
  });

  test("devcontainer.json exists", () => {
    expect(
      fs.existsSync(path.join(__dirname, "../.devcontainer/devcontainer.json"))
    ).toBe(true);
  });
});
