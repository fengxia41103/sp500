# worldsnapshot

Use [Alpha Vantage][1] data feed to plot US stock (SP500) data and
stock analysis.

[1]: https://www.alphavantage.co/documentation/

# development

1. Install [nvm][2]
2. Install node: `nvm install node --lts=Boron`. Latest `node 9.x` will not work as
   dependency packages will break.
3. Upgrade npm: `npm install --upgrade npm`
4. Install packages: `npm install`. Packages are listed in
   `package.json`.
5. Run dev server: `npm run dev`   

[2]: https://github.com/creationix/nvm

# update production

Production site is hosted in `s3://sp500chart` bucket. Once you are
satisfied with dev result, time to update bucket version.

1. Compile `bundle.js` build: `npm run build`
2. Switch to `dist` folder: `cd dist`
3. `pip install awscli`
4. assuming you have setup your AWS account, `aws s3 sync . s3://sp500chart/`.
5. verify on a browser.   

3. (optional) install `s3cmd`: `pip install s3cmd`
4. Upload to s3: `s3cmd put --recursive * s3://sp500chart`
