import { WrapBalancer } from "./wrap-balancer";

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
      </head>
      <body>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint,
          eveniet?
        </p>
        <WrapBalancer>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint,
            eveniet?
          </p>
        </WrapBalancer>
      </body>
    </>
  );
};
