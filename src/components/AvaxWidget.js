import dynamic from 'next/dynamic'
import Router from 'next/router'

const AvalancheDarkblockWidget = dynamic(
  () =>
    import('@darkblock.io/avax-widget').then((mod) => {
      return mod.AvalancheDarkblockWidget
    }),
  { ssr: false }
)

const AvalancheUpgradeWidget = dynamic(
  () =>
    import('@darkblock.io/avax-widget').then((mod) => {
      return mod.AvalancheUpgradeWidget
    }),
  { ssr: false }
)

const cb = (param1) => {
  // console.log(param1)
}

const config = {
  customCssClass: '', // pass here a class name you plan to use
  debug: false, // debug flag to console.log some variables
  imgViewer: {
    // image viewer control parameters
    showRotationControl: true,
    autoHideControls: true,
    controlsFadeDelay: true,
  },
}

const cbUpgrade = (param1) => {
  if (param1 === 'upload_complete') {
    Router.reload()
  }
}

const apiKey = process.env.NEXT_PUBLIC_REACT_APP_API_KEY

export const AvaxWidget = ({ id, contract, w3, upgrade = false , network ='mainnet'}) => {
  if (upgrade) {
    return (
      <AvalancheUpgradeWidget
        apiKey={apiKey}
        contractAddress={contract}
        tokenId={id}
        w3={w3}
        cb={cbUpgrade}
        config={config}
        network={network}
      />
    )
  } else {
    return <AvalancheDarkblockWidget contractAddress={contract} tokenId={id} w3={w3} cb={cb} config={config} network={network} />
  }
}
