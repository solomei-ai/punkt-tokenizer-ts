/**
 * Sets up the environment by downloading NLTK Punkt data, converting it,
 * and then cleaning up the temporary data directory.
 *
 * @returns Promise that resolves when the setup process is complete
 */
declare const setup: () => Promise<void>;
export default setup;
