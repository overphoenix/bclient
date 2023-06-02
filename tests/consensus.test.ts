import consensus from "../lib/bcoin/protocol/consensus";
import BN from "bcrypto/lib/bn.js";

describe("Consensus", function () {
  // very long test - skip it
  it.skip("should calculate reward properly", () => {
    let height = 0;
    let total = 0;

    for (;;) {
      const reward = consensus.getReward(height, 210000);
      expect(reward <= consensus.COIN * 50).toBeTruthy();
      total += reward;
      if (reward === 0) break;
      height++;
    }

    expect(height).toStrictEqual(6930000);
    expect(total).toStrictEqual(2099999997690000);
  });

  it("should verify proof-of-work", () => {
    const bits = 0x1900896c;

    const hash = Buffer.from(
      "672b3f1bb11a994267ea4171069ba0aa4448a840f38e8f340000000000000000",
      "hex",
    );

    expect(consensus.verifyPOW(hash, bits)).toBeTruthy();
  });

  it("should convert bits to target", () => {
    const bits = 0x1900896c;
    const target = consensus.fromCompact(bits);
    const expected = new BN(
      "0000000000000000896c00000000000000000000000000000000000000000000",
      "hex",
    );

    expect(target.toString("hex")).toStrictEqual(expected.toString("hex"));
  });

  it("should convert target to bits", () => {
    const target = new BN(
      "0000000000000000896c00000000000000000000000000000000000000000000",
      "hex",
    );

    const bits = consensus.toCompact(target);
    const expected = 0x1900896c;

    expect(bits).toStrictEqual(expected);
  });

  it("should check version bit", () => {
    expect(consensus.hasBit(0x20000001, 0)).toBeTruthy();
    expect(consensus.hasBit(0x20000000, 0)).toBeFalsy();
    expect(consensus.hasBit(0x10000001, 0)).toBeFalsy();
    expect(consensus.hasBit(0x20000003, 1)).toBeTruthy();
    expect(consensus.hasBit(0x20000003, 0)).toBeTruthy();
  });
});
