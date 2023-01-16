import { WrapBalancer } from "./components/wrap-balancer";

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Wrap Balancer</title>
      </head>
      <body>
        <p>Qwik: A JavaScript framework reimagined for the edge.</p>
        <WrapBalancer>
          <p>Qwik: A JavaScript framework reimagined for the edge.</p>
        </WrapBalancer>
      </body>
    </>
  );
};
