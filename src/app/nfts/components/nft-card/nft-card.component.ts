import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BigNumber, ethers } from 'ethers';
import { CheddaMarketService } from 'src/app/contracts/chedda-market.service';
import { WalletProviderService } from 'src/app/providers/wallet-provider.service';
import { GlobalAlertService } from 'src/app/shared/global-alert.service';
import { NFTCollection } from '../../models/collection.model';
import { NFT } from '../../models/nft.model';

@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.scss'],
})
export class NftCardComponent implements OnInit {

  @Input() nft: any

  constructor(
    private router: Router, 
    private wallet: WalletProviderService, 
    private market: CheddaMarketService,
    private alert: GlobalAlertService,) { }

  ngOnInit() {}

  onNFTSelected(nft: NFT) {
    console.log('nft selected: ', nft)
    this.router.navigate(['/', 'nfts', 'details', nft.nftContract, nft.tokenID.toString()])
  }

  onCollectionSelected(collection: NFTCollection) {
    console.log('collection selected: ', collection)
    this.router.navigate(['./', 'nfts', 'collection', collection.nftContract])
  }

  async onBuyItemClicked($event, nft: NFT) {
    $event.stopPropagation()
    if (this.wallet.isConnected()) {
      const hasSufficient = await this.wallet.balanceIsOver(nft.price)
      if (hasSufficient) {
        let result = await this.market.buyItem(nft)
        console.log('buy result is: ', result)
      } else {
        this.alert.showInsufficientBalanceAlert()
      }
    } else {
      // show error
      this.alert.showConnectAlert()
    }
  }


  formattedPrice(price: BigNumber) {
    return ethers.utils.formatEther(price)
  }
}
