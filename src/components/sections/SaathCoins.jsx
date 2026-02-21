import ThreeCoin from "../ThreeCoin";

export default function SaathCoins() {
  return (
    <section id="saath-coins">
      <div className="section-wrap">
        <div className="coins-grid">
          <div>
            <span className="s-tag">Rewards Program</span>
            <h2 className="s-title">Earn SaathCoins on Every Adventure</h2>
            <p className="s-sub">
              Our loyalty program rewards you for every booking, referral, and
              review. Redeem coins for discounts, free bookings, and exclusive
              experiences.
            </p>

            <ul className="perk-list">
              <li className="perk-item">
                <span>♥</span>
                <span>Earn 100 coins on signup — ready to use instantly</span>
              </li>
              <li className="perk-item">
                <span>♥</span>
                <span>Get 50 coins for every hour booked with a companion</span>
              </li>
              <li className="perk-item">
                <span>♥</span>
                <span>Earn 200 coins for each verified referral you make</span>
              </li>
              <li className="perk-item">
                <span>♥</span>
                <span>Bonus 500 coins on your very first completed booking</span>
              </li>
              <li className="perk-item">
                <span>♥</span>
                <span>Redeem 1,000 coins = ₹100 off your next booking</span>
              </li>
            </ul>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ThreeCoin />
          </div>
        </div>
      </div>
    </section>
  );
}
