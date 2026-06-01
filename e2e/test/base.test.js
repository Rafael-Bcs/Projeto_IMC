const {By, Builder, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3004';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function takeScreenshot(driver, name) {
    try {
        const image = await driver.takeScreenshot();
        const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
        fs.writeFileSync(filePath, image, 'base64');
        console.log(`Screenshot salva: ${filePath}`);
    } catch (e) {
        console.warn('Erro ao tirar foto', e);
    }
}
describe('E2E IMC', () => {
    let driver;

    beforeAll(async () => {
        const options = new chrome.Options();
        options.addArguments(
            '--headless=new',
            '--disable-gpu',
            '--window-size=1920,1080',
            '--no-sandbox',
            '--disable-dev-shm-usage'
        );
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.manage().setTimeouts({ implicit: 5000, pageLoad: 15000 });
    }, 30000);

    afterAll(async () => {
        if (driver) {
            await driver.quit();
        }
    }, 30000);

    test('calcula IMC corretamente e mostra resultado', async () => {
        await driver.get(`${BASE_URL}/`);
        await takeScreenshot(driver, 'Pagina_inicial');

        await driver.findElement(By.name('altura')).sendKeys('1.75');
        await driver.findElement(By.name('peso')).sendKeys('70');
        await takeScreenshot(driver, 'Dados_inseridos');

        await driver.findElement(By.id('calcular')).click();
        await driver.wait(until.elementLocated(By.id('result')), 5000);
        await driver.wait(until.elementTextContains(driver.findElement(By.id('result')), 'IMC:'), 5000);
        await takeScreenshot(driver, 'Resultado_IMC');

        const dataText = await driver.findElement(By.id('result')).getText();
        expect(dataText).toContain('IMC:');
        expect(dataText).toContain('Peso normal');
    }, 30000);

    test('valida entradas inválidas e exibe mensagem de erro', async () => {
        await driver.get(`${BASE_URL}/`);
        await driver.findElement(By.name('altura')).sendKeys('-1');
        await driver.findElement(By.name('peso')).sendKeys('0');
        await driver.findElement(By.id('calcular')).click();

        await driver.wait(until.elementLocated(By.id('result')), 5000);
        await driver.wait(until.elementTextContains(driver.findElement(By.id('result')), 'Informe altura e peso válidos.'), 5000);
        await takeScreenshot(driver, 'Resultado_erro');

        const dataText = await driver.findElement(By.id('result')).getText();
        expect(dataText).toContain('Informe altura e peso válidos.');
    }, 30000);
});